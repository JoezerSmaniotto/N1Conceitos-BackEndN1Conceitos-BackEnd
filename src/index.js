const express = require('express');
const cors = require('cors');
const {uuid,isUuid} = require('uuidv4'); // Cria um id Universal

const app = express();

app.use(cors()); // assim permite que qualquer front-end de qualquer URL acesse o back-end
app.use(express.json()); // Assim recebo JSON de que Request Body de POST 

const projects = [];

//Middlewares

function logRequests(request,response,next) {
  const {method,url } = request;
  
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);
  next(); // Se não chamar o next no final do middleware, o proximo middleware não sera disparado
}

function validateProjectId(request,response,next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid Project ID.'});
  }

  return next();
}

app.use(logRequests);

app.get('/projects',(request, response)=>{
  // // return response.send(`Olá Mundo`)
  
  // const {title, owner} =  request.query;
  // console.log(title);
  // console.log(owner);
  const {title} =  request.query; // Aqui verifica tem tem filtro e qual o conteudo do 
  //filtro colocado no INSOMINIA NO GET, NA ABA QUERY

  const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;
  
  return response.json(results);
});


app.post('/projects',(request, response)=>{
  
  const {title,owner} = request.body;

  const  project = {id: uuid() ,title,owner};
  
  projects.push(project);

  return response.json(project);
});


app.put('/projects/:id',validateProjectId,(request, response)=>{ 
  
  const {id} = request.params;
  
  const projectIndex = projects.findIndex( project => project.id === id);

  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  const {title,owner} = request.body;

  const  project = {
    id,
    title,
    owner
  };
  
  projects[projectIndex] = project;

  return response.json(project);
});


app.delete('/projects/:id',validateProjectId,(request, response)=>{
  
  const {id} = request.params;
  
  const projectIndex = projects.findIndex( project => project.id === id);

  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  projects.splice(projectIndex,1);

  return response.status(204).send(); // Resposta Sem conteudo

});

app.listen(3333,()=>{
  console.log('Back-end started ! !')
});