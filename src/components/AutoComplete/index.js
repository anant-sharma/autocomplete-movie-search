import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from "axios";
import React, { Component } from "react";

const StyledAutocomplete = withStyles({
    endAdornment: {
        display: 'none'
    }
})(Autocomplete);

export class AutoComplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            options: [],
            selectedOptions: [],
        };
    }

    fetchMovieList = (search) => {
        return axios.get(`http://www.omdbapi.com/?apikey=3ba2f82a&s=${search}`)
    }

    fetchMovieListDebounced = AwesomeDebouncePromise(this.fetchMovieList, 800);

    handleInputChange = async (e, value) => {
        if (value.length < 3 || this.state.selectedOptions.length >= 5) {
            this.setState({
                open: false,
            });
            return;
        }

        this.setState({
            loading: true,
        });
        const { data: {
            Search = []
        } = {}
        } = await this.fetchMovieListDebounced(value);
        this.setState({
            options: Search,
            open: !!Search.length,
            loading: false
        });
    }

    handleChange = (e, value) => {
        this.setState({
            selectedOptions: value
        });
    }

    render() {
        const { open = false, options = [], loading = false } = this.state;

        return <StyledAutocomplete
            multiple
            limitTags={5}
            id="multiple-limit-tags"
            options={options}
            loading={loading}
            getOptionLabel={(option) => option.Title}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder="Movie Search" />
            )}
            onInputChange={this.handleInputChange}
            onChange={this.handleChange}
            open={open}
        />
    }
}
