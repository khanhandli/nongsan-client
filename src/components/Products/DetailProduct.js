import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CardActionArea, Rating, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { addCart } from '../../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber } from '../../utils/common';
import { useNavigate } from 'react-router-dom';
import Comment from '../Comment';
import { getDataAPI } from '../../api/fetchData';
export function DetailProduct({ openDraw, setOpenDraw, detailProduct }) {
    const { auth, products } = useSelector((state) => state);
    const socket = auth?.socket;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [comments, setComments] = React.useState([]);

    const [detailProducts, setDetailProducts] = React.useState([]);

    React.useEffect(() => {
        if (detailProduct._id) {
            products.products &&
                products.products.length > 0 &&
                products.products.forEach((product) => {
                    if (product._id === detailProduct._id) setDetailProducts(product);
                });
        }
    }, [detailProduct._id, products]);

    React.useEffect(() => {
        setLoading(true);
        getDataAPI(`comments/${detailProduct._id}?limit=${1 * 6}`)
            .then((res) => {
                setComments((r) => (r = res.data.comments));
                setLoading(false);
            })
            .catch((err) => console.log(err.response.data.msg));
    }, [detailProduct._id]);

    //realtime

    React.useEffect(() => {
        if (socket) {
            socket.emit('joinRoom', detailProduct._id);
        }
    }, [socket, detailProduct._id]);

    React.useEffect(() => {
        if (socket) {
            socket.on('sendCommentToClient', (msg) => {
                setComments([msg, ...comments]);
            });

            return () => socket.off('sendCommentToClient');
        }
    }, [socket, comments]);

    // Reply Comments
    React.useEffect(() => {
        if (socket) {
            socket.on('sendReplyCommentToClient', (msg) => {
                const newArr = [...comments];

                newArr.forEach((cm) => {
                    if (cm._id === msg._id) {
                        cm.reply = msg.reply;
                    }
                });

                setComments(newArr);
            });

            return () => socket.off('sendReplyCommentToClient');
        }
    }, [socket, comments]);

    const prodcutDt = products.products.filter((item) => item.category === detailProduct.category);
    return detailProduct._id ? (
        <div>
            <Drawer anchor="right" open={openDraw} onClose={() => setOpenDraw(false)}>
                <div className="bg-[#28272B] h-full">
                    <div
                        className="flex items-center flex-col p-4 xs:w-0"
                        style={{ width: 800, background: '#28272B' }}
                    >
                        <div className="w-full h-full flex bg-[#28272B]">
                            <CardActionArea>
                                <Stack direction="row">
                                    <CardMedia
                                        component="img"
                                        style={{
                                            maxHeight: '220px',
                                            maxWidth: '220px',
                                            height: '220px',
                                            width: '220px',
                                        }}
                                        image={detailProduct?.image}
                                        alt="green iguana"
                                        className="rounded-lg"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" className="text-white" component="div">
                                            {detailProduct?.title}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-300">
                                            {detailProduct?.description}
                                        </Typography>
                                        <div className="flex items-center mt-4 mb-6">
                                            <Rating
                                                name="simple-controlled"
                                                style={{ color: 'yellow' }}
                                                readOnly
                                                value={Number(
                                                    (detailProduct?.rating / detailProduct?.numReviewers).toFixed(1)
                                                )}
                                                precision={Number(detailProduct?.rating / detailProduct?.numReviewers)}
                                                size="medium"
                                                emptyIcon={<StarBorderIcon fontSize="inherit" color="warning" />}
                                            />
                                            {detailProduct?.numReviewers ? (
                                                <span className="text-white ml-3 opacity-60">
                                                    ({detailProduct?.numReviewers} đánh giá)
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                className="text-white"
                                                component="div"
                                            >
                                                {formatNumber(detailProduct?.price)}{' '}
                                                <span className="text-xl mr-3">₫</span>
                                            </Typography>
                                            {detailProduct?.discount ? (
                                                <div className="flex">
                                                    <Typography
                                                        gutterBottom
                                                        variant="h6"
                                                        className="text-gray-400 line-through"
                                                        component="div"
                                                    >
                                                        {formatNumber(detailProduct?.price_old)}{' '}
                                                        <span className="text-xl mr-3">₫</span>
                                                    </Typography>
                                                    <div className="discount">-{detailProduct?.discount}%</div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <Button
                                                onClick={() => {
                                                    dispatch(
                                                        addCart({
                                                            loged: auth?.token,
                                                            product: detailProduct,
                                                            cart: auth.cart,
                                                            token: auth.token,
                                                        })
                                                    );
                                                    navigate('/cart');
                                                }}
                                                variant="contained"
                                                startIcon={<AddShoppingCartIcon />}
                                            >
                                                Mua ngay
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Stack>
                            </CardActionArea>
                        </div>
                        <Comment comments={comments} id={detailProduct._id} socket={socket} />
                    </div>
                </div>
            </Drawer>
        </div>
    ) : (
        <></>
    );
}

export default React.memo(DetailProduct);
