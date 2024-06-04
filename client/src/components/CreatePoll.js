import React from 'react';
import '../App.css';

const SERVER_PORT = 3000;

class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answers: ["", ""], question: "", end: "" };
        
        this.updateValue = this.updateValue.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.updateEnd = this.updateEnd.bind(this);
        this.renderAnswers = this.renderAnswers.bind(this);
    }

    changeAnswer(event, i) { this.state.answers[i] += event.target.value; }
    
    renderAnswer(answer, i) {
        return <input type="text" id={`ans${i}`} key={`ans${i}`} defaultValue={answer} onChange={x => changeAnswer(x, i)}></input>;
    }
    
    renderAnswers() {
        return <div>{this.state.answers.map(renderAnswer)}</div>;
    }
    
    async createAnswers(pollId) {
        for (let i = 0; i < this.state.answers.length; i++) {
            const answer = this.state.answers[i];
            fetch(`http://127.0.0.1:${SERVER_PORT}/answers`, {
                method: 'POST',
                body: JSON.stringify({ pollId, i, answer }),
            });
        }
    }
    
    async createPoll() {
        const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
        const authData = await authResponse.json();
        if (authResponse.status === 200) {
            const question = document.getElementById("question").value;
            const end = document.getElementById("time").value;
            const nAnswers = document.getElementById("slider").value;
            const id = authData.id;
            const response = fetch(`http://127.0.0.1:${SERVER_PORT}/polls`, {
                method: 'POST',
                body: JSON.stringify({ nAnswers, id, question, end }),
            });
            createAnswers(response.id);
        }
    }
    
    updateQuestion(event) {
        this.setState({ question: event.target.value });
    }
    
    updateEnd(event) {
        this.setState({ end: event.target.value });
    }

    async updateValue(event) {
        const value = parseInt(event.target.value);
        if (this.state.answers.length < value) {
            while (this.state.answers.length !== value) { this.state.answers.push(""); }
        }
        else if (this.state.answers.length > value) {
            while (this.state.answers.length !== value) { this.state.answers.pop(); }
        }
    }
    
    render () {
        <div className="App">
            <label id="notification"></label>
            <div>Question: </div><input type="text" id="question" name="question" placeholder="Poll question" onChange={updateQuestion}></input>
            <div>End time: </div><input type="text" id="time" name="time" placeholder="YYYY-MM-DD" onChange={updateEnd}></input>
            <div>Answers: </div><input type="range" min="2" max="20" defaultValue="2" name="slider" id="slider" onChange={updateValue}></input><div id="sliderVal">{this.state.answers.length}</div>
            <div id="answerList">{this.renderAnswers()}</div>
            <button type="submit" onClick={createPoll}>Submit</button>
        </div>
    };
}

export default CreatePoll;