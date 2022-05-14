import React from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { DATA_URL } from "../../env";

export default function Register() {
    const [phone, setPhone] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isPassword, setIsPassword] = React.useState(false);
    const navigate = useNavigate();

    const handleChange = (e, type) => {
        if (type === "phone") setPhone(e.target.value);
        else if (type === "password") setPassword(e.target.value);
        else if (type === "username") setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneRegex = /\d{10,11}\w+/g;
        const usernameRegex = /^[a-zA-Z0-9]{6,20}$/g;
        if (phone.length < 11) {
            setError({
                type: "phone",
                message: "Phone number must be 11 digits",
            });
            return;
        }
        if (!phoneRegex.test(phone)) {
            setError({
                type: "phone",
                message: "Phone number must be 11 digits",
            });
            return;
        }

        if (password.length < 6) {
            setError({
                type: "password",
                message: "Password must be at least 6 characters",
            });
            return;
        }
        if (username.length < 6) {
            setError({
                type: "username",
                message: "Username must be at least 6 characters",
            });
            return;
        }
        if (!usernameRegex.test(username)) {
            setError({
                type: "username",
                message:
                    "Username must be alphanumeric and at least 6 characters",
            });
            return;
        }
        setError("");
        try {
            const formData = {
                phone,
                username,
                password,
            };
            const response = await fetch(`${DATA_URL}/user/register`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.error) {
                if (response.status === 400) {
                    setError({
                        type: data.type,
                        message: "Phone number already exists",
                    });
                }
            } else {
                setError("");
                alert("Registered successfully");
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "username")}
                        required
                        type="text"
                        placeholder="Enter username"
                        maxLength={12}
                        value={username}
                    />
                    <Form.Text className="text-muted">
                        {error && error.type === "username" && error.message}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "phone")}
                        required
                        type="text"
                        placeholder="Enter mobile"
                        maxLength={12}
                        value={phone}
                    />
                    <Form.Text className="text-muted">
                        {error && error.type === "phone" && error.message}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={(e) => handleChange(e, "password")}
                        required
                        type={isPassword ? "text" : "password"}
                        placeholder="Enter password"
                        maxLength={16}
                        value={password}
                    />
                    <Form.Text className="text-muted">
                        {error && error.type === "password" && error.message}
                    </Form.Text>

                    {password.length > 0 && (
                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsPassword((prev) => !prev)}
                        >
                            {!isPassword ? "Show" : "Hide"} password.
                        </p>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            <Stack className="mt-4">
                <p>
                    Already have an account? <Link to="/">Login</Link>{" "}
                </p>
            </Stack>
        </Container>
    );
}
