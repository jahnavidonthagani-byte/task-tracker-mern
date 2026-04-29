import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css"

const App = () => {

  const [data, setData] = useState([])
  const [task, setTask] = useState({ title: "", desc: "", dl: "" })
  const [f, setF] = useState(true)
  const [ef, setEF] = useState(true)

  const fun = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    axios.get("http://localhost:5000/getall")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [f])

  const add = () => {
    axios.post("http://localhost:5000/add", task).then(() => {
      setF(!f)
      setTask({ title: "", desc: "", dl: "" })
    })
  }

  const del = (id) => {
    axios.delete(`http://localhost:5000/del/${id}`).then(() => {
      setF(!f)
    })
  }

  const edit = (obj) => {
    setTask({ ...obj, dl: obj.dl.slice(0, 10) })
    setEF(false)
  }

  const upd = () => {
    axios.put("http://localhost:5000/upd", task).then(() => {
      setF(!f)
      setEF(true)
      setTask({ title: "", desc: "", dl: "" })
    })
  }

  const cmp = (id) => {
    axios.put("http://localhost:5000/upd", { _id: id, status: "completed" }).then(() => {
      setF(!f)
    })
  }

  let i = 0, ci = 0

  return (
    <div>

      {/* FORM */}

      <div className="container">
      <h1 className="mainHeading">Task Management System</h1>
      <div className="form">
        <input
          type="text"
          placeholder="enter title"
          onChange={fun}
          value={task.title}
          name="title"
        />

        <input
          type="text"
          placeholder="enter desc"
          onChange={fun}
          value={task.desc}
          name="desc"
        />

        <input
          type="date"
          onChange={fun}
          value={task.dl}
          name="dl"
        />

        {ef && <button onClick={add}>Add</button>}
        {!ef && <button onClick={upd}>Update</button>}
      </div>

      {/* PENDING TASKS */}
      <div className="tbl">
        <h1>Tasks Pending:</h1>

        <table border={1}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Complete</th>
            </tr>
          </thead>

          <tbody>
            {data.map((obj) => {
              if (obj.status === "pending") {
                i++
                return (
                  <tr key={obj._id}>
                    <td>{i}</td>
                    <td>{obj.title}</td>
                    <td>{obj.desc}</td>
                    <td>{new Date(obj.dl).toLocaleDateString()}</td>
                    <td><button onClick={() => edit(obj)}>Edit</button></td>
                    <td><button onClick={() => del(obj._id)}>Delete</button></td>
                    <td><button onClick={() => cmp(obj._id)}>Complete</button></td>
                  </tr>
                )
              }
              return null
            })}
          </tbody>
        </table>
      </div>

      {/* COMPLETED TASKS */}
      <div className="tbl">
        <h1>Tasks Completed:</h1>

        <table border={1}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {data.map((obj) => {
              if (obj.status !== "pending") {
                ci++
                return (
                  <tr key={obj._id}>
                    <td>{ci}</td>
                    <td>{obj.title}</td>
                    <td>{obj.desc}</td>
                    <td>{new Date(obj.dl).toLocaleDateString()}</td>
                    <td><button onClick={() => del(obj._id)}>Delete</button></td>
                  </tr>
                )
              }
              return null
            })}
          </tbody>
        </table>
      </div>
      </div>

    </div>
  )
}

export default App