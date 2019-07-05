"use strict";

import React from 'react';

import {withStyles} from "@material-ui/core/styles";

import {TextField, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText} from "@material-ui/core";
import {withRouter} from "react-router-dom";

/**
 *UniversityUserInput
 * Component for the fields, which are needed for the university user in registration
 * Author: Maria
 */
const styles = theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: "10px",
        textAlign: "center",
    },
    button: {
        marginRight: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});

class UniversityUserInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            validations: {
                uniValid: false,
                facValid: false,
                chairValid: false,
                authorizationValid: false
            },
            textUni: "University required",
            textFac: "Faculty required",
            textChair: "Chair required",
            textAuthorization: "Authorization required",
            universityId: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.showUniverisitiesInDropdown = this.showUniverisitiesInDropdown.bind(this);
    }

    componentWillMount() {
        if (this.props.profile){
            this.setState({
                validations: {
                    uniValid: true,
                    facValid: true,
                    chairValid:true,
                    authorizationValid: true},
                    universityId: this.props.user.university,
                    textUni: '',
                    textChair: '',
                    textFac: '',
                    textAuthorization: ''
            })
        }
        this.setState({
            validations: this.props.validations
        })
    }

    validateInput(value, field) {
        let message = '';
        let fieldValid = false;

        switch (field) {
            case "University":
                if (value.length !== 0) {
                    fieldValid = true;
                } else {
                    message = field + " required"
                }
                break;
            case "Faculty":
            case "Chair":
                if (value.length !== 0) {
                    fieldValid = true;
                } else {
                    message = field + " required"
                }
                break;
            case "Authorization":
                //TODO: safe AuthorizationKey in backend
                if (value === "uni42") {
                    fieldValid = true;
                } else {
                    fieldValid = false;
                    message = "Invalid " + field;
                }
            default:
                break;
        }
        return [fieldValid, message]
    }

    handleChange(e) {
        const value = e.target.value;
        const field = e.target.id;
        const valid = this.validateInput(value, field);
        switch (field) {

            case "Faculty":
                this.props.validations.facValid = valid[0];
                this.props.user.faculty = value;
                this.setState({
                    facValid: valid[0],
                    textFac: valid[1]});
                break;
            case "Chair":
                this.props.validations.chairValid = valid[0];
                this.props.user.chair = value;
                this.setState({
                    chairValid: valid[0],
                    textChair: valid[1]});
                break;
            case "Authorization":
                this.props.validations.authorizationValid = valid[0];
                this.props.user.authorization = value;
                this.setState({
                    authorizationValid: valid[0],
                    textAuthorization: valid[1]});
            default:
                console.log("error")
        }
        this.props.onUpdate();
        if(this.props.profile){
            this.props.resetSaveButton()
        }
    }

    handleDropdown(e) {
        this.props.user.university = e.target.value;
        this.props.validations.uniValid = true;
        this.setState({
            universityId: e.target.value,
            textUni: ""
        });
        this.props.onUpdate();
        if(this.props.profile){
            this.props.resetSaveButton()
        }

    }

    showUniverisitiesInDropdown(universities){
        return universities.map((item, i) => {
                return (<MenuItem key={i} value={item._id}> {item.name} </MenuItem>);
            })
    }

    render() {
        let authorizationField = <TextField
                                    label="Authorization"
                                    id="Authorization"
                                    type="text"
                                    required={true}
                                    value={this.props.user.authorization}
                                    onChange={this.handleChange}
                                    helperText={this.state.textAuthorization}
                                    variant="standard"
                                    error={!this.props.validations.authorizationValid}
                                    margin="dense"/>;
        const classes = this.props;
        return (
            <Grid container direction="column">
                <FormControl  className={classes.formControl}
                                  error={!this.props.validations.uniValid}>
                    <InputLabel> University </InputLabel>
                    <Select
                        value={this.state.universityId}
                        onChange={this.handleDropdown}
                        >
                        {this.showUniverisitiesInDropdown(this.props.universities)}
                    </Select>
                    <FormHelperText>{this.state.textUni}</FormHelperText>
                </FormControl>
                <TextField
                    label="Faculty"
                    id="Faculty"
                    type="text"
                    required={true}
                    value={this.props.user.faculty}
                    onChange={this.handleChange}
                    error={!this.props.validations.facValid}
                    helperText={this.state.textFac}
                    variant="standard"
                    margin="dense"/>
                <TextField
                    label="Chair"
                    id="Chair"
                    type="text"
                    required={true}
                    value={this.props.user.chair}
                    onChange={this.handleChange}
                    helperText={this.state.textChair}
                    error={!this.props.validations.chairValid}
                    variant="standard"
                    margin="dense"/>
                {!this.props.profile ? authorizationField : null}
            </Grid>
        );
    };
}

export default withRouter(withStyles(styles)(UniversityUserInput));

