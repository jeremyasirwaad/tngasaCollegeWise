import React, { useState, useContext } from "react";
import "./Login.css";
import { Stepper, Step } from "react-form-stepper";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase.config";
import { Toaster, toast } from "react-hot-toast";
import OTPInput from "otp-input-react";
import { useNavigate } from "react-router-dom";
import clgocde_prici from "../../data/clgcode_pricipal.json";
import userContext from "../../context/user-context";
import ClipLoader from "react-spinners/ClipLoader";

export const Login = () => {
	const { setuserclgcode } = useContext(userContext);

	const navigate = useNavigate();

	const [stage1loader, setStage1loader] = useState(false);
	const [clgcode, setClgcode] = useState("");
	const [stepnumber, setstepnumber] = useState(0);
	const [priciphone, setPriciphone] = useState("");
	const [otp, setOtp] = useState();

	const configureCaptchaVerify = () => {
		window.recaptchaVerifier = new RecaptchaVerifier(
			"sign-in-button",
			{
				size: "invisible",
				callback: (response) => {
					// reCAPTCHA solved, allow signInWithPhoneNumber.
					onSignInSubmit();
					console.log("Recaptcha verified");
				},
				defaultCountry: "IN"
			},
			auth
		);
	};

	const onSignInSubmit = (e) => {
		e.preventDefault();
		setStage1loader(true);
		var phoneno = clgocde_prici.find((clg) => clg.ccode == clgcode).pricipal;
		configureCaptchaVerify();
		const phoneNumber = "+91" + phoneno;
		setPriciphone(phoneNumber);
		console.log(phoneNumber);
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phoneNumber, appVerifier)
			.then((confirmationResult) => {
				// SMS sent. Prompt user to type the code from the message, then sign the
				// user in with confirmationResult.confirm(code).
				window.confirmationResult = confirmationResult;
				toast.success("OTP has been sent");
				console.log("OTP has been sent");
				setstepnumber(1);
				// ...
			})
			.catch((error) => {
				// Error; SMS not sent
				// ...
				toast.success("SMS not Sent");
				console.log(error);
				console.log("SMS not sent");
			});
	};

	const onSubmitOTP = (e) => {
		e.preventDefault();
		const code = otp;
		console.log(code);
		window.confirmationResult
			.confirm(code)
			.then((result) => {
				// User signed in successfully.
				const user = result.user;
				console.log(JSON.stringify(user));
				setuserclgcode(clgcode);
				navigate("/table");
				// ...
			})
			.catch((error) => {
				var err = JSON.stringify(error);
				if (error) {
					toast.error("Invalid OTP");
				}

				// User couldn't sign in (bad verification code?)
				// ...
			});
	};

	return (
		<div className="loginpage">
			<Toaster />
			<div id="sign-in-button"></div>
			<div className="steppercont">
				<Stepper
					activeStep={stepnumber}
					styleConfig={{ activeBgColor: "indigo", completedBgColor: "indigo" }}
				>
					<Step label="Enter College Code" />
					<Step label="Enter OTP" />
					<Step label="Login" />
				</Stepper>
			</div>
			{stepnumber == 0 && (
				<div className="logincontainer">
					<div className="loginlogocont">
						{" "}
						<span className="loginlogo">LOGIN</span>
						<div className="logodash"></div>
					</div>

					<div className="logininput">
						<div className="inputstyle">
							<span>Enter College Code:</span>
							<input
								onChange={(e) => {
									setClgcode(e.target.value);
								}}
								type="text"
								placeholder="College Code"
							/>
						</div>

						{stage1loader ? (
							<button onClick={onSignInSubmit}>
								<ClipLoader color="white" size={20} />
							</button>
						) : (
							<button onClick={onSignInSubmit}>Get OTP</button>
						)}
					</div>
				</div>
			)}

			{stepnumber == 1 && (
				<div className="logincontainer">
					<div className="loginlogocont">
						{" "}
						<span className="loginlogo">Login</span>
						<div className="logodash"></div>
					</div>
					<p style={{ textAlign: "center" }}>
						OTP has been sent to the principal's mobile {priciphone}
					</p>
					<div className="logininput">
						<div className="inputstyle2">
							<span>Enter OTP</span>
							<OTPInput
								className={"otpinput"}
								value={otp}
								onChange={(e) => {
									setOtp(e);
								}}
								autoFocus
								OTPLength={6}
								otpType="number"
								disabled={false}
							/>
						</div>

						<button onClick={onSubmitOTP}>Login</button>
					</div>
				</div>
			)}
		</div>
	);
};
