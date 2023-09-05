import React, { useState, useEffect } from 'react';




const ImageScrollBar = ({ images, fun }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageArrLength = images.length;
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((currentImageIndex + 1) >= imageArrLength ? 0 : currentImageIndex + 1)
        }, 3000);

        return () => {
            clearInterval(interval);
        };

    }, [currentImageIndex])
    return (
        <>
            <div className="bg-cover bg-center bg-no-repeat h-screen transition-all ease-in-out-quart duration-900" style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}>
                {fun()}
            </div>
        </>
    );
};

export default ImageScrollBar;
