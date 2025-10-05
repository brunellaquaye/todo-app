// const connection = require('../db/pgConnection')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


exports.createTask = async(req, res) => {
  console.log("Received POST request:", req.body);

    try{
    if (!req.body.title) {
        
        return res.status(400).json({ error: 'Title is required'});
      }

      if (await prisma.tasks.findFirst({
        where : {title: req.body.title}
      })) {
        return res.status(400).json({ error: `${req.body.title} task already exists`, code: err.code });
      } 


      const newTask = await prisma.tasks.create({
        data: {
            title: req.body.title,   
            description: req.body.description,
            due_date: req.body.due_date,
            priority: req.body.priority,
            completed: req.body.completed ?? false
        }
      })

      return res.status(201).json(newTask)
    }catch(error){
      return res.status(500).json({error:error.message})
    }
  

  }



exports.getTask =  async(req, res) => {
  

  try{
    const tasks = await prisma.tasks.findMany()

    return res.status(200).json(tasks)
  }catch(error){
    return res.status(500).json({error:error.message})
  }
};


exports.updateTasks = async(req, res) =>{
    try{
        // check to see if the data you are trying to update exists or not
        if (!await prisma.tasks.findFirst({where: {id : parseInt(req.params.id)}})){
            return res.status(404).json({error: 'Tasks not found'})
        }

        if (!req.body.title ){
            return res.status(422).json({error: 'Title is required'})
        }

        if (await prisma.tasks.findFirst({where : {title: req.body.title}})){
            return res.status(409).json({error:`${req.body.title} tasks already exists`})
        }

        const updatedtasks = await prisma.tasks.update({
            data: {
                title: req.body.title
            },
            where: {
                id: parseInt(req.params.id)
            }
        })
        return res.status(200).json(updatedtasks)
    }catch(error){
        return res.status(500).json({error : error.message})
    }

}






exports.deleteTasks = async(req, res) => {
  try{
    if (!await prisma.tasks.findFirst({where: {id: parseInt(req.params.id)}})){
      return res.status(404).json({
        error: 'Task not found'})
    }

    await prisma.tasks.delete({
      where:{
        id: parseInt(req.params.id)
      }
    })

    return res.status(204).send()
  }catch(error){
    return res.status(500).json({error: error.message})
  }
};




  