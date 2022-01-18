import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Typography from '@mui/material/Typography';
import { CardActionArea, Rating, Stack } from '@mui/material';
import { formatNumber } from '../../utils/common';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
export default function DetailProduct({ openDraw, setOpenDraw, detailProduct }) {
    console.log('🚀 ~ file: DetailProduct.js ~ line 14 ~ DetailProduct ~ detailProduct', detailProduct);
    return (
        <div>
            <Drawer anchor="right" open={openDraw} onClose={() => setOpenDraw(false)}>
                <div
                    className="flex items-center flex-col h-full p-4"
                    style={{ width: 800, background: '#28272B', objectFit: 'cover' }}
                >
                    <div className="w-full flex">
                        <CardActionArea>
                            <Stack direction="row">
                                <CardMedia
                                    component="img"
                                    style={{ maxHeight: '300px', maxWidth: '300px', height: '240px', width: '240px' }}
                                    image={detailProduct.image}
                                    alt="green iguana"
                                    className="rounded-lg"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" className="text-white" component="div">
                                        {detailProduct.title}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-300">
                                        {detailProduct.description}
                                    </Typography>
                                    <div className="flex items-center mt-4 mb-6">
                                        <Rating
                                            name="simple-controlled"
                                            style={{ color: 'yellow' }}
                                            value={Number((detailProduct.rating / detailProduct.numReviews).toFixed(1))}
                                            precision={0.1}
                                            size="medium"
                                            emptyIcon={<StarBorderIcon fontSize="inherit" color="warning" />}
                                        />
                                        {!detailProduct.numReviews && (
                                            <span className="text-white ml-3 opacity-60">
                                                ({detailProduct.numReviews}123)
                                            </span>
                                        )}
                                    </div>
                                    <Typography gutterBottom variant="h5" className="text-white" component="div">
                                        {formatNumber(detailProduct.price)} <spa className="text-sm">Đồng</spa>
                                    </Typography>
                                    <div className="mt-4">
                                        <Button variant="contained" startIcon={<AddShoppingCartIcon />}>
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </div>
                                </CardContent>
                            </Stack>
                        </CardActionArea>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
