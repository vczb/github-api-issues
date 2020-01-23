import React, {useState, useCallback} from 'react';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';

import {Container, Form, SubmitButton, List, DeleteButton} from './styles';

import api from '../../services/api';

export default function Main(){

  const [newRepo, setNewRepo] = useState('');
  const [allRepo, setAllRepo] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit(){
      setLoading(true);

      try{
        const response = await api.get(`repos/${newRepo}`);

        const data = {
          name: response.data.full_name,
        }

        setAllRepo([...allRepo, data]);
        setNewRepo('');
      }catch(err){
        console.log(err);
      }finally{
        setLoading(false);
      }

    }
    submit();

  }, [newRepo, allRepo]);

  function hangleInputChange(e){
    setNewRepo(e.target.value)
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

    <Form onSubmit={handleSubmit}>
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
          <a href="" >
            <FaBars size={20}/>
          </a>
        </li>
      ))}
    </List>
    </Container>
  )
}
