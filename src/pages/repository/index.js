import React, {useState, useEffect} from 'react';
import {Container,Owner,Loading,BackButton, IssuesList} from './styles';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

export default function Repository({match}){

  const [repository, setRepository] = useState({});
  const [issues, setIssues]         = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(()=>{

    async function load(){
      const nameRepo = decodeURIComponent(match.params.repository);
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`repos/${nameRepo}`),
        api.get(`repos/${nameRepo}/issues`,{
          params:{
            state: 'open',
            per_page: 5
          }
        })
      ])
      setRepository(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();

  },[])

  if (loading) {
    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return(

    <Container>

      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>  {repository.name}         </h1>
        <p>   {repository.description}  </p>
      </Owner>

      <IssuesList>
        {
          issues.map(issues =>(
            <li key={String(issues.id)} >
              <img src={issues.user.avatar_url} alt={issues.user.login}/>
              <div>
                <strong>
                  <a href={issues.html_url} > {issues.title} </a>

                  {
                    issues.labels.map(label=>(
                      <span key={label.id} > {label.name} </span>
                    ))
                  }
                </strong>
                <p>
                  { issues.user.login }
                </p>
              </div>
            </li>
          ))
        }
      </IssuesList>

    </Container>
  )
}
