import new_post from '../../models/new-post'
import connectDb from '../../middleware/mongoose'
connectDb()
export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body)
        try {
            const newPost = new new_post({
                img: req.body.image
            })
            await newPost.save()
            res.status(200).json({ success: "Image posted" })
        } catch {
            res.status(201).json({ message: 'Internal server error' })

        }
    }










    //   if (req.method === 'POST') {
    //     const data = req.body
    //     console.log(data)
    //     const client = await MongoClient.connect('mongodb://localhost:27017/blog-nextjs')
    //     const db = client.db()

    //     const postCollections = db.collection('posts')
    //     const result = await postCollections.insertOne(data)
    //     console.log(result, 'this is result')

    //     client.close()
    //     res.status(201).json({message: 'Post Inserted'})
    //   }
}