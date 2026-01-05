import { useState, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    '/slider/slider1.webp',
    '/slider/slider2.webp',
    '/slider/slider3.webp',
];

export const HeroSlider = () => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = slides.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, md: 500, lg: 600 },
                overflow: 'hidden',
                borderRadius: 0,
                bgcolor: 'white'
            }}
        >
            {slides.map((step, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: activeStep === index ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        backgroundImage: `url(${step})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top center',
                    }}
                />
            ))}

            {/* Navigation Arrows */}
            <IconButton
                onClick={handleBack}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' }
                }}
            >
                <ChevronLeft size={32} />
            </IconButton>

            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' }
                }}
            >
                <ChevronRight size={32} />
            </IconButton>

            {/* Indicators */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1.5
                }}
            >
                {slides.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setActiveStep(index)}
                        sx={{
                            width: activeStep === index ? 32 : 12,
                            height: 6,
                            borderRadius: 4,
                            bgcolor: activeStep === index ? 'primary.main' : 'rgba(255,255,255,0.6)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    />
                ))}
            </Box>
        </Paper>
    );
};
