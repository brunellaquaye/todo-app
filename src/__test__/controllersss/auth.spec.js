

// create or stub data or mock for the system that we are usingdo not use the actual databease because we are doing unit tests and that has to be fast

jest.mock('@prisma/client', ()=>{
    const mockPrisma = {
        tasks:{
            findFirst:jest.fn(),
            update:jest.fn(),
            create:jest.fn(),
            delete:jest.fn(),
            findMany:jest.fn()
        }
    }
    return {PrismaClient:jest.fn(()=>mockPrisma)}
})

const { createTask, updateTasks, getTask, deleteTasks } = require('../../controllers/taskControllers');


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();





const req = {
    params:{id:'1'},
    body: {
            title: 'fake_title' ,  
            description: 'fake_description',
            due_date: 'fake_date',
            priority: 'fake_priority',
            completed: 'false'
    }
}

const res = {
    // this is the mock return body that has the send and json functions
    status: jest.fn().mockReturnThis(),
    json:jest.fn()
}


it('should send status code of 500 when tasks exists', async()=>{
    // create or stub data or mock for the system that we are using
    prisma.tasks.findFirst.mockImplementationOnce(()=>({
        title: 'title' ,  
            description: 'description',
            due_date: 'date',
            priority: 'priority',
            completed: 'false'
    }))
    await createTask(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:expect.any(String),
        })
    )
    });
;

// this is happy test for create
it('should send status code of 200 when task is created', async()=>{
       prisma.tasks.findFirst.mockResolvedValueOnce(null); // No existing task
  prisma.tasks.create.mockResolvedValueOnce({
    id: 1,
    title: 'fake_title',
    description: 'fake_description',
    due_date: 'fake_date',
    priority: 'fake_priority',
    completed: false
  });

  await createTask(req, res);

  // Assertions
  expect(prisma.tasks.findFirst).toHaveBeenCalledTimes(1);
  expect(prisma.tasks.create).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    id: 1,
    title: 'fake_title',
    description: 'fake_description',
    due_date: 'fake_date',
    priority: 'fake_priority',
    completed: false
  });
});

it('should return 400 if title is missing', async () => {
  const invalidReq = {
    body: {}, // wen no title provided
  };

  await createTask(invalidReq, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'Title is required' });
});



// tests for get request
// this is for the if block 
it('should send status code of 200 and task should be listed', async()=>{
    const mockTasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
    ];

       prisma.tasks.findMany.mockResolvedValueOnce(mockTasks); //list of tasks

    

  await getTask(req, res);

  // Assertions
  expect(prisma.tasks.findMany).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockTasks);
});

// for the else block 
it('should send status code of 500 when all tasks not returned', async()=>{
    // create or stub data or mock for the system that we are using
    prisma.tasks.findMany.mockRejectedValueOnce(new Error('Error with database,can not return all tasks'))

    await getTask(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:expect.any(String),
        })
    )
    });
;

// tests for update
it('should send status code of 404 when task not found', async()=>{
    // create or stub data or mock for the system that we are using
    prisma.tasks.findFirst.mockResolvedValueOnce(null)
    await updateTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:'Tasks not found',
        })
    )
    });
;

it('should return 422 if title is missing', async () => {
prisma.tasks.findFirst.mockResolvedValueOnce({ id: 1 }); // to show that the tasks exists 
//and below, it exists, but there is no title
  const noTitleReq = {
    params:{id:'1'},
    body: {}, // wen no title provided
  };

  await updateTasks(noTitleReq, res);

  expect(res.status).toHaveBeenCalledWith(422);
  expect(res.json).toHaveBeenCalledWith({ error: 'Title is required' });
});

it('should send status code of 409 when tasks already exists', async()=>{
    // create or stub data or mock for the system that we are using
    prisma.tasks.findFirst.mockResolvedValueOnce({id:1}).mockResolvedValueOnce({id: 2})
    await updateTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:`${req.body.title} tasks already exists`,
        })
    )
    });

it('should send status code of 200 when tasks  updated', async()=>{
    // create or stub data or mock for the system that we are using
    prisma.tasks.findFirst.mockResolvedValueOnce({id:1}).mockResolvedValueOnce(null)

    prisma.tasks.update.mockResolvedValueOnce({
  id: 1,
  title: 'fake_title',
  description: 'fake_description',
  due_date: 'fake_date',
  priority: 'fake_priority',
  completed: 'false'
});


    await updateTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            id:1,
            title: 'fake_title' ,  
            description: 'fake_description',
            due_date: 'fake_date',
            priority: 'fake_priority',
            completed: 'false'
    }
        )
    )
    });


    // it should return 500 if all fails 
it('should send status code of 500 when task not updated and databse error', async()=>{
     prisma.tasks.findFirst.mockImplementationOnce(() => { 
    throw new Error('Database error'); 
  });

    await updateTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:expect.any(String),
        })
    )
    });
;



// unit tests for delete
it('should send status code of 404 when task not found', async()=>{
    prisma.tasks.findFirst.mockResolvedValueOnce(null)
    await deleteTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:'Task not found',
        })
    )
    });
;

  it('should delete task and return 204 ', async () => {
    prisma.tasks.findFirst.mockResolvedValueOnce({ id: 1 });
    prisma.tasks.delete.mockResolvedValueOnce();

    await deleteTasks(req, res);

    expect(prisma.tasks.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });



it('should send status code of 500 when task not deleted and databse error', async()=>{
     prisma.tasks.findFirst.mockImplementationOnce(() => {
    throw new Error(' error');
  });

    await deleteTasks(req,res);


    // write an assertion
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            error:expect.any(String),
        })
    )
    });
;