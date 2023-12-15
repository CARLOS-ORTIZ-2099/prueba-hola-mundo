
import { useEffect, useState } from 'react'
import './App.css'

const initialvalue = {name:'', email:'', address:''}

function App() {

  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(initialvalue)

useEffect(() => {
  petitionUsers()
}, [])

async function petitionUsers(){
    try{
      const response = await fetch(`http://localhost:3000/users`)
      console.log(response)
      if(!response.ok){
        let errorPetition = new Error(`ocurrio un error en el servidor`)
        errorPetition.status = response.status || '000'
        errorPetition.statusText = response.statusText || 'mensaje personalizado'
        throw errorPetition 
      }
      const data = await response.json()
      console.log(data)
      setUsers(data)
      localStorage.setItem('users-server',JSON.stringify(data))
    }catch(error){
      console.log(error)
      setError(error.message)
    }

}


async function deletePetition(idUser){
  try{
    const deleteUser = await fetch(`http://localhost:3000/users/${idUser}`,{
        method:'DELETE'
    })
    console.log(deleteUser)
    const usersRemain = await deleteUser.json()
    petitionUsers()
  }catch(error){
    console.log(error)
    setError(error)
  }
}

const sendInfo = async (e) => {
  e.preventDefault()
    try{
      const send = await fetch(`http://localhost:3000/users`,{
        method:'POST',
        headers: {'content-type': 'application/json'},
        body:JSON.stringify(info)
      })
      console.log(send)
      if(send.ok){
        petitionUsers()
      }
    }catch(error){
      console.log(error)
    }finally{
      setInfo(initialvalue)
    }
}

const textFunction = ({target}) => {
  console.log(target.value)
  console.log(target.name)
  setInfo({...info, [target.name]: target.value})
}

  return (
    <>
        <form onSubmit={sendInfo}>
            <input value={info.name} type="text" name='name' placeholder='tyoe here your name'onChange={textFunction} />
            <input value={info.email} type="email" name='email' placeholder='type your email' onChange={textFunction}/>
            <input value={info.address} type="text" name='address' placeholder='type your address'onChange={textFunction} />
            <button>send </button>
        </form>

        {
          users.map(({address, email, id, name}) => (
            <div key={id}>
                  <h1>name: {name}</h1>
                  <p>email: {email}</p>
                  <p>address:{address.city}</p>
                  <button onClick={() => deletePetition(id)}>delete user</button>
            </div>
          ))
        }
    </>
  )
}

export default App
