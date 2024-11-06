import express from 'express'
import {Book} from "../models/book-models.js"  
const router=express.Router()
//MIDDLEWARE
const getBook= async(req, res, next)=>{
    let book;
    const{id}=req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message:"El id del libro no es valido"
        })}
        try{
            book= await Book.findById(id)
            if(!book){
                return res.status(404).json({
                    message:"El libro no existe"
                })
            }
        }catch(e){
            return res.status(500).json({
                message:e.message
            })
        }
        res.book=book
        next()
    }


//Obtener todas las rutas
 router.get('/', async(req, res) => {
    try{
        const books=await Book.find()
        if(books.length===0){ 
            res.status(204).json("No se encontraron libros")
        }else{
            res.json(books)
        }
    }catch(e){
    res.status(500).json({message:e.message})
    }
}  )

//Crerar un nuevo libro
router.post('/', async(req, res)=>{
   const  {title,author,genre, publication_date}=req?.body
   if(!title||!author||!genre||!publication_date){
    return res.status(400).json({
        message:"Los campos estan incompletos"
    })
   }
   const book= new Book(
    {
        author,
        genre,
        title,
        publication_date
     }
   )
   try{
    const newBook=await book.save()
    res.status(201).json({
        message: newBook})
   }catch(e){
        res.status(400).json({
            message:e.message
        })
   }
})

router.get("/:id", getBook, async(req, res)=>{
    res.json(res.book)
})


router.put("/:id", getBook, async(req, res)=>{
    try{
        const book= res.book
        book.title=req.body.title || book.title
        book.genre=req.body.genre || book.genre
        book.author=req.body.author || book.author
        book.publication_date=req.body.publication_date || book.publication_date
        const updateBook= await book.save()
        res.json(updateBook)
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    } 
})

router.patch("/:id", getBook, async(req, res)=>{
    if(!req.body.title&&!req.body.author&&!req.body.genre&&!req.body.publication_date)
    {
        res.status(400).json({
            message:"Al menos uno de los campos debe ser enviado"
        })
    }
    try{
        const book= res.book
        book.title=req.body.title || book.title
        book.genre=req.body.genre || book.genre
        book.author=req.body.author || book.author
        book.publication_date=req.body.publication_date || book.publication_date
        const updateBook= await book.save()
        res.json(updateBook)
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    } 
})


router.delete("/:id", getBook, async(req, res)=>{
    try{
        const book= res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message:`El libro ${book.title} fue eliminado de la base de datos`
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})
export default router;