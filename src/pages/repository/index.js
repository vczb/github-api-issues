import React, {useState, useEffect} from 'react';
import {Container,Owner,SelectBox,Loading,BackButton, IssuesList, PageActions} from './styles';
import { FaArrowLeft,FaAngleDoubleLeft,FaAngleDoubleRight } from 'react-icons/fa';
import api from '../../services/api';

export default function Repository({match}){

  const [repository, setRepository] = useState({});
  const [issues, setIssues]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [filter, setFilter]         = useState('open');
  const options                     = ['open','closed','all'];

  useEffect(()=>{

    async function load(){
      const nameRepo = decodeURIComponent(match.params.repository);
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`repos/${nameRepo}`),
        api.get(`repos/${nameRepo}/issues`,{
          params:{
            state: filter,
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

  useEffect(()=>{

    async function loadIssue(){
      const nameRepo = decodeURIComponent(match.params.repository);

      const response = await api.get(`repos/${nameRepo}/issues`,{
        params:{
          state: filter,
          page,
          per_page: 5
        }
      });
      setIssues(response.data);
    }

    loadIssue();

  }, [match.params.repository,page,filter]);

  function handlePage(action){
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleSelect(option){
    setFilter(options[option]);
  }

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

      <strong>Listar:</strong>
      <SelectBox onChange={(e)=> handleSelect(e.target.selectedIndex)} >
        {
          options.map(option =>(
            <option key={option} name={option} >
              {
                option === 'open' ?
                  'Abertas'
                :
                option === 'closed' ?
                  'Fechadas'
                :
                  'Todas'
              }
            </option>
          ))
        }
      </SelectBox>

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
      <PageActions>
        <button
          type="button"
          onClick={()=> handlePage('back')}
          disabled={page < 2}
          >
           <FaAngleDoubleLeft  size={30}/>
        </button>
        <button type="button" onClick={()=> handlePage('next')}>
          <FaAngleDoubleRight size={30}/>
        </button>
      </PageActions>

    </Container>
  )
}
