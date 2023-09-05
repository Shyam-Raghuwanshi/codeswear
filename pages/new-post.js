import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
export default function NewPostForm() {


    /******************for base 64 *****************************/
    function uploadFile() {
        const image = document.getElementById('image')
        var file = image.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            console.log('Encoded Base 64 File String:', reader.result);
        }
        reader.readAsDataURL(file);
    }

    const blob = ''



    return (
        <>
            <div className="pt-32 pb-32 pl-16">
                <div id="main"></div>
                {blob && <img src={blob} alt="Img" />}
                <div className='flex flex-col'>
                    <label className='mb-5' > Please choose an image</label>
                    <input onChange={uploadFile} type="file" name="image" id="image" />
                </div>
            </div>
        </>
    );
}