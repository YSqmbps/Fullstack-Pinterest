import { forwardRef } from 'react';
import { IKImage } from "imagekitio-react";

const Image = forwardRef(({ path, alt, className, w, h, onClick }, ref) => {
    return (
          <IKImage
                urlEndpoint={import.meta.env.VITE_URL_IK_ENDPOINT}
                path={path}
                transformation={[{ 
                    height: h, 
                    width: w 
                }]}
                alt={alt}
                className={className}
                lqip={{ active: true ,quality: 20}}
                onClick={onClick}  
                ref={ref}          
            />
    )
})

Image.displayName = "Image";

export default Image;