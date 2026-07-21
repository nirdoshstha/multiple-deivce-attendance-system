import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import api from '../../../api/api'
import { showError, showSuccess } from '../../../utils/notify';
import { BounceLoader, ClipLoader, PulseLoader } from 'react-spinners';
import { useAuth } from '../../../context/AuthContext';
import "../../../assets/frontend/css/loginstyle.css"

const Login = () => {

    const { user, updateAuthState } = useAuth();

    const navigate = useNavigate();

    const [login, setLogin] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const handleInput = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const data = {
            email: login.email,
            password: login.password
        }

        try {
            const result = await api.post('/login', data)
            if (result.data.status === 200) {
                showSuccess(result.data.message);
                updateAuthState(result.data.token, result.data.user);

                navigate("/admin/dashboard");
            }
            else {
                showError('You are not authorized to access this page');
                setLoading(false);
                return;
            }

        } catch (error) {
            console.log(error)
            showError(error.response.data.message)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    // Register Part 

    const [register, setRegister] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: ''
    });
    const [terms, setTerms] = useState(false);

    const handleRegisterInput = (e) => {
        setRegister({ ...register, [e.target.name]: e.target.value });
    }



    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name: register.name,
            email: register.email,
            password: register.password,
            cpassword: register.cpassword
        }

        if (register.password !== register.cpassword) {
            showError('Password and confirm password doesnot matched')
            setLoading(false);
            return;
        }

        if (!terms) {
            showError('You must agree the Terms & Conditions');
            setLoading(false);
            return;
        }

        try {
            const result = await api.post('/register', data)
            // console.log(result)
            if (result.data.status == 200) {
                showSuccess(result.data.message);
                navigate("/login");
                setRegister({
                    name: "",
                    email: "",
                    password: "",
                    cpassword: ""
                })
            }
            else {
                showError("Something Went Wrong")
            }

        } catch (error) {
            // console.log(error)
            showError(error.response.data.message)

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='d-flex justify-content-center align-items-center p-4'>
            {/* <section className="hero-section d-flex align-items-center justify-content-center">

                <div className="container position-relative">
                    <div className="row align-items-center">

                         
                        <div className="col-lg-5 ms-auto fade-right">
                            <div className="glass-card register-card">
                                <h2 className="register-title">
                                    Sign in
                                </h2>
                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">
                                        <input type="email" name='email' value={login.email} onChange={handleInput} className="form-control" placeholder="Email Address" />
                                    </div>

                                    <div className="mb-3">
                                        <input type="password" name='password' value={login.password} onChange={handleInput} className="form-control" placeholder="Password" />
                                    </div>

                                    {
                                        !loading ?
                                            <button type='submit' className="btn btn-register w-100 text-white">
                                                Login In
                                            </button>
                                            :
                                            <button type='button' className="btn btn-register w-100 text-white">
                                                <PulseLoader
                                                    color='white'
                                                    loading={true}
                                                    size={14}
                                                /> Login In
                                            </button>
                                    }


                                </form><br />

                                <p>Already have an Account ? <Link to="/register" className='color:#ffffff;' style={{

                                    color: "#fe6937", textDecoration: "none"
                                }} >Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            <div className="auth-card">
                {/* STATE: these two radios are the only "logic" in the page.
          modeLogin is checked by default; picking either one drives
 every visual change below via CSS sibling selectors. */}
                <input type="radio" name="authMode" id="modeLogin" className="mode-radio" defaultChecked />
                <input type="radio" name="authMode" id="modeSignup" className="mode-radio" />
                <div className="card-inner">
                    <header className="card-header">
                        {/* <span className="brand-mark" aria-hidden="true">◆</span> */}
                        <h1 className="brand-name text-dark">Sign In</h1>
                        {/* Mode switch: each label sets one specific radio, so
                          clicking "Log in" always means "log in", regardless of
     the current state (a plain checkbox toggle can't promise that). */}
                        <div className="mode-switch">
                            <label htmlFor="modeLogin" className="mode-option">Log in</label>
                            <label htmlFor="modeSignup" className="mode-option">Sign up</label>
                            <span className="mode-knob" aria-hidden="true" />
                        </div>
                    </header>
                    <div className="forms-viewport">
                        <div className="forms-track">
                            {/* ============ LOGIN PANEL ============ */}
                            <section className="form-panel" aria-label="Log in">
                                {/* <h2 className="panel-title">Welcome back</h2> */}
                                {/* <p className="panel-sub">Sign in to keep working.</p> */}
                                {/* novalidate turns off the browser's default error
                                  bubbles so our own :invalid styling can take over
                                  instead; the underlying constraint validation
         (required / pattern / minlength) still runs. */}

                                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                                    <div className="field">
                                        <input type="email" name='email' value={login.email} onChange={handleInput} id="loginEmail" placeholder=" " required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" autoComplete="off" />
                                        <label htmlFor="loginEmail">Email</label>
                                        <span className="error-msg">Enter a valid email address.</span>
                                    </div>
                                    <div className="field">
                                        <input type="password" name='password' value={login.password} onChange={handleInput} id="loginPassword" placeholder=" " required minLength={8} autoComplete="off" />
                                        <label htmlFor="loginPassword">Password</label>
                                        <span className="error-msg">Password must be at least 8 characters.</span>
                                    </div>
                                    {
                                        !loading ? <button type="submit" className="submit-btn">Log in</button>
                                            :
                                            <button type="button" className="submit-btn">
                                                <PulseLoader
                                                    color='white'
                                                    loading={true}
                                                    size={14}
                                                />Log in</button>

                                    }

                                </form>
                                <p className="switch-line">
                                    New here ?
                                    <label htmlFor="modeSignup" className="switch-link">Create an account</label>
                                </p>
                            </section>
                            {/* ============ SIGN UP PANEL ============ */}
                            <section className="form-panel" aria-label="Sign up">
                                {/* <h2 className="panel-title">Get started</h2> */}
                                {/* <p className="panel-sub">Create your account in a minute.</p> */}
                                <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
                                    <div className="field">
                                        <input type="text" name='name' value={register.name} onChange={handleRegisterInput} id="signupName" placeholder=" " required minLength={2} autoComplete="off" />
                                        <label htmlFor="signupName">Full name</label>
                                        <span className="error-msg">Tell us your name.</span>
                                    </div>
                                    <div className="field">
                                        <input type="email" name='email' value={register.email} onChange={handleRegisterInput} id="signupEmail" placeholder=" " required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" autoComplete="off" />
                                        <label htmlFor="signupEmail">Email</label>
                                        <span className="error-msg">Enter a valid email address.</span>
                                    </div>
                                    <div className="field">
                                        {/* Note: pure CSS has no way to compare two field
                                          values, so a "passwords match" check for a
                                          confirm-password field genuinely requires JS.
                                          This field is left out here rather than faking
                                          a check that wouldn't actually work; the single
                                          password field still enforces required + a
             minimum length. */}
                                        <input type="password" name='password' value={register.password} onChange={handleRegisterInput} id="signupPassword" placeholder=" " required minLength={5} autoComplete="off" />
                                        <label htmlFor="signupPassword">Password</label>
                                        <span className="error-msg">Password must be at least 5 characters.</span>
                                    </div>
                                    <div className="field">
                                        <input type="password" name='cpassword' value={register.cpassword} onChange={handleRegisterInput} id="signupCPassword" placeholder=" " required minLength={5} autoComplete="off" />
                                        <label htmlFor="signupCPassword">Confirm Password</label>
                                    </div>
                                    <div className="field">
                                        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} name='terms' placeholder="Confirm Password" />
                                        <span> I agree to the Terms & Conditions.</span>
                                    </div>

                                    {
                                        !loading ? <button type="submit" className="submit-btn">Create account</button>
                                            :
                                            <button type="button" className="submit-btn"><PulseLoader
                                                color='white'
                                                loading={true}
                                                size={14}
                                            />Create account</button>
                                    }
                                </form>
                                <p className="switch-line">
                                    Already have an account?
                                    <label htmlFor="modeLogin" className="switch-link">Log in</label>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Login