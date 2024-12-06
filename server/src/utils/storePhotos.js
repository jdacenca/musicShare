'use strict';

import { createClient } from '@supabase/supabase-js';
import { decode } from "base64-arraybuffer";

export const uploadPhoto = async function(req, res) {

    try {
        // Create a single supabase client for interacting with your database
        const supabase = createClient(process.env.STORAGE_URL, process.env.STORAGE_ANON)
        const file = req.file;

        console.log(req.body.userId)
        if (!file) {
            res.status(400).json({ message: 'Please upload a file' });
            return;
        }

        // decode file buffer to base64
        const fileBase64 = await decode(file.buffer.toString("base64"));

        // upload the file to supabase
        const { data, error } = await supabase.storage
        .from(process.env.STORAGE_BUCKET_NAME)
        .upload(req.body.userId + ".jpg", fileBase64, {
            upsert: true,
          });

        if (error) {
            console.log(error)
            throw error;
        }

        res.status(200).json({ image: 'https://wpuszkmujlxtpxdugyof.supabase.co/storage/v1/object/public/beatSnapPhotos/' + req.body.userId + '.jpg' });
    
    } catch (error) {

        res.status(500).json({ error: error });
    }
}