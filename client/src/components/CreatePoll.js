import React from 'react';
import '../App.css';

const SERVER_PORT = 3000;

class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answers: ["", ""], question: "", end: "" };
        
        this.updateValue = this.updateValue.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.updateEnd = this.updateEnd.bind(this);
        this.renderAnswers = this.renderAnswers.bind(this);
    }

    changeAnswer(event, i) { this.state.answers[i] += event.target.value; }
    
    renderAnswer(answer, i) {
        return <input type="text" id={`ans${i}`} key={`ans${i}`} defaultValue={answer} onChange={x => this.changeAnswer(x, i)}></input>;
    }
    
    renderAnswers() {
        let renderedAnswers = [];
        for (let i = 0; i < this.state.answers.length; i++) {
            renderedAnswers.push(this.renderAnswer(this.state.answers[i], i));
        }
        return <div>{renderedAnswers}</div>;
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
            const { answers, question, end } = this.state;
            const nAnswers = answers.length;
            const id = authData.id;
            const response = fetch(`http://127.0.0.1:${SERVER_PORT}/polls`, {
                method: 'POST',
                body: JSON.stringify({ nAnswers, id, question, end }),
            });
            this.createAnswers(response.id);
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
        const answers = this.state.answers;
        if (this.state.answers.length < value) {
            while (this.state.answers.length !== value) { answers.push(""); }
        }
        else if (this.state.answers.length > value) {
            while (this.state.answers.length !== value) { answers.pop(); }
        }
        this.setState({ answers: answers });
    }
    
    render () {
        return (
        <div className="App">
            <label id="notification"></label>
            <div>Question: </div><input type="text" id="question" name="question" placeholder="Poll question" onChange={this.updateQuestion}></input>
            <div>End time: </div><input type="text" id="time" name="time" placeholder="YYYY-MM-DD" onChange={this.updateEnd}></input>
            <div>Answers: </div><input type="range" min="2" max="20" defaultValue="2" name="slider" id="slider" onChange={this.updateValue}></input><div id="sliderVal">{this.state.answers.length}</div>
            <div id="answerList">{this.renderAnswers()}</div>
            <button type="submit" onClick={this.createPoll}>Submit</button>
        </div>);
    };
}

export default CreatePoll;