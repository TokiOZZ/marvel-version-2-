import { Component } from "react";
import ErrorMesage from "../error/ErrorMesage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMesage />
        }
        return this.props.children
    }
}

export default ErrorBoundary