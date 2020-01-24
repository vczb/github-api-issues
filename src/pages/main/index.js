import React, {useState, useCallback, useEffect} from 'react';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {Container, Form, SubmitButton, List, DeleteButton} from './styles';

import api from '../../services/api';

export default function Main(){

  const [newRepo, setNewRepo] = useState('');
  const [allRepo, setAllRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert  , setAlert]   = useState(null);

  //DidMount
  useEffect(()=>{

    const repoStorage = localStorage.getItem('repos');

    if(repoStorage){
      setAllRepo(JSON.parse(repoStorage));
    }
  },[])

  // DidUpdate

  useEffect(()=>{
    localStorage.setItem('repos', JSON.stringify(allRepo));
  }, [allRepo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit(){
      setLoading(true);
      setAlert(null);
      try{

        if(newRepo === ''){
          throw new Error('Você precisa indicar um repositório!');
        }

        const response = await api.get(`repos/${newRepo}`);

        const hasRepo = allRepo.find(repo => repo.name === newRepo);

        if(hasRepo){
          throw new Error('Repositório duplicado!');
        }

        const data = {
          name: response.data.full_name,
        }

        setAllRepo([...allRepo, data]);
        setNewRepo('');

      }catch(err){
        setAlert(true);
        console.log(err);
      }finally{
        setLoading(false);
      }

    }
    submit();

  }, [newRepo, allRepo]);

  function hangleInputChange(e){
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback((repo) => {
    const find = allRepo.filter(r => r.name !== repo)
    setAllRepo(find);
  },[allRepo]);

  return(
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

    <Form onSubmit={handleSubmit} error={alert}>
      <input type="text"
        placeholder="Adicionar repositórios"
        value={newRepo}
        onChange={hangleInputChange}
        />
      <SubmitButton loading={loading ? 1 : 0} >
        { loading ? (
          <FaSpinner color="#FFF" size={14} />
        ) : (
          <FaPlus color="#FFF" size={14} />
        )
        }
      </SubmitButton>
    </Form>

    <List>
      {allRepo.map(repo => (
        <li key={repo.name} >
          <span>
            <DeleteButton onClick={()=> handleDelete(repo.name)} >
              <FaTrash size={14} />
            </DeleteButton>
            {repo.name}
          </span>
          <Link to={`/repository/${ encodeURIComponent(repo.name) }`} >
            <FaBars size={20}/>
          </Link>
        </li>
      ))}
    </List>
    </Container>
  )
}
