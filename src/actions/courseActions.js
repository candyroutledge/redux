import * as types from './actionTypes';
import cousrseApi from '../api/mockCourseApi';
import {beginAjaxCall} from './ajaxStatusActions';

export function createCourse(course){
    return {type: types.CREATE_COURSE, course: course};
}

export function loadCoursesSuccess(courses){
    return {type: types.LOAD_COURSES_SUCCESS, courses: courses};
}

export function createCourseSuccess(course){
    return {type: types.CREATE_COURSE_SUCCESS, course};
}

export function updateCourseSuccess(course){
    return {type: types.UPDATE_COURSE_SUCCESS, course};
}

export function loadCourses(){
    return function(dispatch){
        dispatch(beginAjaxCall());
        return cousrseApi.getAllCourses().then((courses) => {
            dispatch(loadCoursesSuccess(courses));
        }).catch((error) => {throw(error);});
    };
}

export function saveCourse(course){
    return function (dispatch, getState){
        dispatch(beginAjaxCall());
        return cousrseApi.saveCourse(course).then((savedCourse) => {
            course.id ? dispatch(updateCourseSuccess(savedCourse)) :
            dispatch(createCourseSuccess(savedCourse));
        }).catch((error) => {throw(error);});
    };
}