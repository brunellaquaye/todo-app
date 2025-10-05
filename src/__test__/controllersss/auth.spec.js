

// create or stub data or mock for the system that we are usingdo not use the actual databease because we are doing unit tests and that has to be fast

jest.mock('@prisma/client', ()=>{
    const mockPrisma = {
        tasks:{
            findFirst:jest.fn(),
            update:jest.fn()
        }
    }
    return {PrismaClient:jest.fn(()=>mockPrisma)}
})

const { createTask } = require('../../controllers/taskControllers');
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