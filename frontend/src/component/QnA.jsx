import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/QnA.css';

function QnA() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/questions')
      .then(res => setQuestions(res.data));
  }, []);

  const handlePost = () => {
    axios.post('http://localhost:8000/questions', {
      ...form,
      posted_by: 1  // hardcoded user_id for now
    }).then(() => {
      alert("Question Posted");
      window.location.reload();
    });
  };

  return (
    <div className="qna-container">
      <div className="qna-form">
        <input type="text" placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="text" placeholder="Tags (comma-separated)" onChange={e => setForm({ ...form, tags: e.target.value })} />
        <button onClick={handlePost}>Post Question</button>
      </div>

      <div className="qna-list">
        {questions.map(q => (
          <div key={q.id} className="qna-card">
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <p className="tags">Tags: {q.tags}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QnA;
