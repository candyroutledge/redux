import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';

class ManageCoursePage extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            course: Object.assign({}, props.course),
            errors: {},
            saving: false
        };
        this.updateCourseState = this.updateCourseState.bind(this);
        this.saveCourse = this.saveCourse.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.course.id != nextProps.course.id){
            this.setState({course: Object.assign({}, nextProps.course)});
        }
    }

    updateCourseState(event){
        const field = event.target.name;
        let course = this.state.course;
        course[field] = event.target.value;
        return this.setState({course: course});
    }

    saveCourse(event){
        event.preventDefault();
        this.setState({saving: true});
        this.props.actions.saveCourse(this.state.course).then(() => {
            this.setState({saving: false});
            this.context.router.push('/courses');});
    }

    render(){
        return(
        <div>
            <CourseForm course={this.state.course}
            onChange={this.updateCourseState}
            onSave={this.saveCourse}
            errors={this.state.errors}
            allAuthors={this.props.authors}
            loading={this.state.saving} />
        </div>);
    }
}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    errors: PropTypes.object,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

ManageCoursePage.contextTypes = {
    router: PropTypes.object
};

function getCourseById(courses, id){
    const course = courses.filter((course) => course.id == id);
    if(course) return course[0];
    return null;
}

function mapStateToProps(state, ownProps){
    const courseId = ownProps.params.id;
    let tempCourse = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};

    if(courseId && state.courses.length > 0){
        tempCourse = getCourseById(state.courses, courseId);
    }
    const authorsFormattedForDropdown = state.authors.map((author) => {
        return {
            value: author.id,
            text: author.firstName + ' ' + author.lastName
        };
    });
    return {course: tempCourse, authors: authorsFormattedForDropdown};
}

function mapDispatchToProps(dispatch){
    return {actions: bindActionCreators(courseActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);