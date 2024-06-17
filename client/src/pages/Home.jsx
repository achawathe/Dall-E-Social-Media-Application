import React,{useState, useEffect}  from 'react'

import {Loader, Card, FormField} from '../components'

const RenderCards = ({data, title}) => {
  if(data?.length > 0){
    return data.map((posts) => <Card key={posts.id} {...posts} />);
  }

  return (<h2 className="mt5 font-bold text-[#6469ff] text-xl uppercase"> {title} </h2>);
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allposts, setAllPosts] = useState(null)
  const [searchtext, setSearchtext] = useState('')
  const [searchedResults, setSearchedResults] = useState(null)
  const [searchTimeout, setSearchTimeout] = useState([])

  useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        
      })
      if(response.ok){
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }


    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    
    setSearchtext(e.target.value);
    
    
    setSearchTimeout(
    setTimeout(() => {
        const searchedResults = allposts.filter((item) => item.name.toLowerCase().includes(searchtext.toLowerCase()) || item.prompt.toLowerCase().includes(searchtext.toLowerCase()));
        
        setSearchedResults(searchedResults);
      }, 500));

      
  }


  
  
  return (
    <section className="max-w-7x1 mx=auto">
        <div>
            <h1 className="font-extrabold text-[#222328] text-[32px]">
                The Community Showcase
            </h1>
            <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
                Browse through the amazing images our community has created. 
            </p>
        </div>
        <div className="mt-16">
            <FormField 
              labelName="Search Posts"
              type = "text"
              name = "text"
              placeholder="Search Posts"
              value = {searchtext}
              handleChange = {handleSearchChange}
            />
        </div>
        <div className="mt-10">
          {loading? (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          ):(
            <div>
            {searchtext && (<h2 className="font-medium text-[#666e75] text-xl mb-3"> Search results for <span className=' text-[#222328]'></span></h2>)}

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2">
              {searchtext? (
                <RenderCards data={searchedResults} title="No search results found" />
              ): (
                <RenderCards data={allposts} title="No Posts Found" />
              )}
              </div>

          </div>)}
        </div>
    </section>
  )
}

export default Home