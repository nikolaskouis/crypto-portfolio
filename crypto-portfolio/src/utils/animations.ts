export const circleLineEffect = {
    borderRadius: '50%',
    border: '2px solid transparent',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        borderColor: 'white',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
        transform: 'scale(1.05)',
    },
};

export const linkUnderlineEffect = {
    my: 2,
    mx: 1.5,
    color: 'white',
    position: 'relative',
    fontWeight: 500,
    fontSize: '1rem',
    textTransform: 'none',
    cursor: 'pointer',
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: -4,
        height: '2px',
        width: '100%',
        backgroundColor: 'white',
        transform: 'scaleX(0)',
        transformOrigin: 'right',
        transition: 'transform 0.3s ease',
    },
    '&:hover::after': {
        transform: 'scaleX(1)',
        transformOrigin: 'left',
    },
};

export const footerUnderlineEffect = {
    my: 1,
    display: 'block',
    textDecoration: 'none',
    color: 'white',
    position: 'relative',
    fontWeight: 500,
    fontSize: '1rem',
    textTransform: 'none',
    cursor: 'pointer',
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: -4,
        height: '2px',
        width: '100%',
        backgroundColor: 'white',
        transform: 'scaleX(0)',
        transformOrigin: 'right',
        transition: 'transform 0.3s ease',
    },
    '&:hover::after': {
        transform: 'scaleX(1)',
        transformOrigin: 'left',
    },
};
