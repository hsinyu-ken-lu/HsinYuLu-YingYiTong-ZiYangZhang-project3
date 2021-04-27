import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
// import { updateCommentByCommentId } from '../model/comment.model';
// import {findCommentsByCommentId, deleteCommentByCommentId} from '../model/comment.model'

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.postId = props.postId;
        this.commentId = props.commentId;
        this.state = {
            comment: Object,
            content:'',
            updateDate: Date.now()
        };
    }

    // get comment by id
    
        getCommentById() {
        axios.get(`/home/comment/comments/${this.postId}/${this.commentId}`, {})
            .then((response) => {
                console.log(response.data);
                this.setState({
                    comment: response.data.res_body
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    componentDidMount() {
        this.getCommentById();
    }

    deleteCommentByCommentId() {
        this.setState({doesExist:false});
        axios.delete(`/home/comment/comments/${this.postId}/${this.commentId}`, {})
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    updateCommentByCommentId() {
        const updates = {content: this.state.content, updateDate:this.state.updateDate}
        this.setState({comment:this.state})
        axios.patch(`/home/comment/comments/${this.postId}/${this.commentId}`, updates)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    comment: response.data.res_body
                })
            })
            .catch((error) => {
                console.error(error);
            })
        this.getCommentById();
    }

    showOrHideInput(id) {
        const display = document.getElementById(id).style.display;
        document.getElementById(id).style.display = display === 'none' ? 'inline' : 'none';
    }

    render() {

        // const { render } = this.state;
        if (this.state.doesExist === false) return null;


        const comment = this.state.comment;

        let modifyButtonSet;
        if (comment.account === this.props.login.account) {
            modifyButtonSet = (
                <div>
                <div className="action">
                    <button onClick={() => this.showOrHideInput(this.commentId)}>Edit Comment</button>
                    <button onClick={() => this.deleteCommentByCommentId()}>Delete Comment</button>
                </div>
                <div id={comment.commentId} style={{ display: 'none' }} >

                     <input type="text" 
                        onChange={(e) => this.setState({content: e.target.value})} />
                    <button onClick={() => this.updateCommentByCommentId()}>Submit</button>
                    <button onClick={() => this.showOrHideInput(this.commentId)}>Cancel</button>
                </div></div>
            )
        }

        return (
            <div>
                <div>{comment.account}</div>
                <div>{comment.createDate}</div>
                <div>{comment.content}</div>
                {/* <div className="action">
                    <button onClick={() => this.showOrHideInput(this.commentId)}>Edit Comment</button>
                    <button onClick={() => this.deleteCommentByCommentId()}>Delete Comment</button>
                </div>
                <div id={comment.commentId} style={{ display: 'none' }} >

                     <input type="text" 
                        onChange={(e) => this.setState({content: e.target.value})} />
                    <button onClick={() => this.updateCommentByCommentId()}>Submit</button>
                    <button onClick={() => this.showOrHideInput(this.commentId)}>Cancel</button>
                </div> */}
                {modifyButtonSet}
            </div>


        )

    }

}

let mapDispatchToProps = function(dispatch, props) {
    return {
        setToken: (val) => {
          dispatch(val);
        }
    }
}

let mapStateToProps = function(state, props) {
    return {
      login: state.login
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comment);