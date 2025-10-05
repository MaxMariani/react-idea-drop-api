import express from 'express';

const router = express.Router();


const ideas = [{
    id: 1, title: "Idea 1", description: "This is idea 1"
},
{
    id: 2, title: "Idea 2", description: "This is idea 2"
}];

// @route           GET /api/ideas
// @description     Get all ideas
// @access          Public
router.get('/', (req, res) => {
    res.status(400);
    throw new Error("This is an error");
    res.json(ideas);
})

// @route           POST /api/ideas
// @description     Create new idea
// @access          Public
router.post('/', (req, res) => {
    const {title, description} = req.body;
    console.log(description)
    res.send(title);
})



export default router;