import { Link as RouterLink } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    IconButton,
    Box,
    Chip,
    Tooltip,
    Stack
} from '@mui/material';
import { useAppDispatch } from '../hooks';
import { addToCart } from '../store/slices';
import type { Product } from '../types';
import { ShoppingCart, CheckCircle2, PackageSearch } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ product }));
    };

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                bgcolor: 'background.paper',
            }}
        >
            <CardActionArea
                component={RouterLink}
                to={`/products/${product.id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Image Container */}
                <Box sx={{ position: 'relative', pt: '100%', bgcolor: 'grey.50' }}>
                    <CardMedia
                        component="img"
                        image={product.imageUrl || ''}
                        alt={product.name}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: 4,
                            transition: 'transform 0.5s ease',
                            '.MuiCard-root:hover &': {
                                transform: 'scale(1.08)',
                            }
                        }}
                    />

                    {/* Placeholder if no image */}
                    {!product.imageUrl && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.light',
                            opacity: 0.2
                        }}>
                            <PackageSearch size={80} />
                        </Box>
                    )}

                    {/* Tags */}
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                    >
                        {product.tags.slice(0, 2).map((tag) => (
                            <Chip
                                key={tag}
                                label={tag.replace('_', ' ')}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(4px)',
                                    fontWeight: 900,
                                    fontSize: '0.625rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    height: 24,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                        ))}
                    </Stack>

                    {/* Stock Warning */}
                    <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                        {product.stock < 5 && product.stock > 0 && (
                            <Chip
                                label="AZALAN STOK"
                                size="small"
                                color="warning"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: '0.625rem',
                                    height: 24,
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                        )}
                        {product.stock === 0 && (
                            <Chip
                                label="TÜKENDİ"
                                size="small"
                                sx={{
                                    bgcolor: 'grey.900',
                                    color: 'white',
                                    fontWeight: 900,
                                    fontSize: '0.625rem',
                                    height: 24
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            mb: 1,
                            display: 'block'
                        }}
                    >
                        {product.category?.name || 'GENEL'}
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            mb: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            transition: 'color 0.3s ease',
                            '.MuiCard-root:hover &': { color: 'primary.main' }
                        }}
                    >
                        {product.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.6,
                            flexGrow: 1
                        }}
                    >
                        {product.description}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {product.benefits.slice(0, 2).map((benefit, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    bgcolor: 'grey.50',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'grey.100'
                                }}
                            >
                                <CheckCircle2 size={12} color="#10b981" />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem' }}>
                                    {benefit}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'between',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.50'
                    }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Fiyat
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                ₺{product.price.toLocaleString('tr-TR')}
                            </Typography>
                        </Box>

                        <Tooltip title={product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}>
                            <span>
                                <IconButton
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    sx={{
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            transform: 'scale(1.05)'
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: 'grey.100',
                                            color: 'grey.400'
                                        }
                                    }}
                                >
                                    <ShoppingCart size={22} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
