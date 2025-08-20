import { useEffect, useRef, useState } from 'react'
import './App.css'
import { API_KEY } from './config/keys';

function App() {

  const [ list , updateList ] = useState([]);
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ page , setPage ] = useState(1);
  const loadingRef = useRef(null);

  const posterUrl = 'https://image.tmdb.org/t/p/w200/';
  //function to fetch images

  const fetchImages = async()=>{
   try{
     const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`);
     const data = await response.json();
     if(data.success == false){
      throw new Error(data.status_message);
     }
     console.log(data);
     setLoading(false);
     updateList(prev => {
      const filteredMovie = data.results.filter((current)=>{
        return !prev.find(movie => movie.id==current.id)
      })

      return [...prev,...filteredMovie];
     })

     
   }catch(err){
    setError(err.message);
   }
  }

  useEffect(()=>{
    fetchImages();
  },[page])

  useEffect(()=>{
    
    if(!loadingRef.current) return;
    
    const observer = new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting==true){
        setPage(prev=> prev+1);
      }
    },{ threshold : 1 })

    observer.observe(loadingRef.current);

    return ()=>{ observer.disconnect(); } 
  },[])
  
  return (
    <main>
      <h1 className='heading'>Infinite Scroll</h1>
      <section className='movie-list'>
      { list && list.map((movie)=>{
        return <div key={movie.id}>
          <img src={posterUrl+movie.poster_path} alt="" />
          
        </div>
      })}
      </section>
      <p ref={loadingRef}>loading</p>
      { error && <p>{error}</p> }
    </main>
  )
}

export default App
