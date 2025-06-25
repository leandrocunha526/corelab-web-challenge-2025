import { FormEvent, useEffect, useState } from "react";
import AuthService from "./../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../../assets/notes.png";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Container, LeftSide, LogoContainer, Logo, WelcomeText, InfoText, RightSide, FormContainer, AlertBox, Input, InputWrapper, ToggleButton, Button, Loading, RegisterLink } from "./styles";

const SignUp = () => {
    const [fullName, setFullName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("token-expiration");

        if (token && expiration) {
            const now = new Date();
            const expDate = new Date(expiration);
            if (now < expDate) {
                navigate("/dashboard");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fullName || !email || !password || !password2) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        if (password !== password2) {
            setError("As senhas são diferentes.");
            return;
        }

        if (email.length < 6) {
            setError("O email deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        // Validação de senha com pelo menos 1 maiúscula e 1 número
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/
        if (!passwordRegex.test(password)) {
            setError("A senha deve conter pelo menos uma letra maiúscula e um número.");
            return;
        }

        setLoading(true); // Inicia o carregamento

        try {
            const registered = await AuthService.register(
                fullName,
                email,
                password
            );

            if (registered) {
                navigate("/signin");
            } else {
                setError(
                    "Erro ao tentar registrar ou usuário existente. Tente novamente."
                );
            }
        } catch (error: any) {
            setError(
                "Erro ao tentar registrar. Verifique as informações e tente novamente."
            );
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    return (
        <Container>
            <LeftSide>
                <LogoContainer>
                    <Logo src={logo} alt="CoreNotes Logo" />
                </LogoContainer>
                <WelcomeText>CoreNotes</WelcomeText>
                <InfoText>Realize o cadastro para começar a usar.</InfoText>
            </LeftSide>
            <RightSide>
                <FormContainer onSubmit={handleSubmit}>
                    <h2>Registrar</h2>
                    {error && <AlertBox>{error}</AlertBox>}
                    <Input
                        type="text"
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputWrapper>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha maior que 6 dígitos"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <ToggleButton
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            title="Mostrar senha"
                        >
                            {showPassword ? (
                                <FaEyeSlash size={20} />
                            ) : (
                                <FaEye size={20} />
                            )}
                        </ToggleButton>
                    </InputWrapper>
                    <InputWrapper>
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                        <ToggleButton
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                            title="Mostrar senha"
                        >
                            {showConfirmPassword ? (
                                <FaEyeSlash size={20} />
                            ) : (
                                <FaEye size={20} />
                            )}
                        </ToggleButton>
                    </InputWrapper>
                    <Button
                        type="submit"
                        data-testid="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loading>Enviando...</Loading>
                        ) : (
                            <>
                                <RiSendPlane2Fill
                                    size="15"
                                    style={{ marginRight: "5px" }}
                                />
                                Registrar
                            </>
                        )}
                    </Button>
                    <RegisterLink>
                        <span className="divider">Ou</span>
                        <Link to="/signin">Voltar ao login</Link>
                    </RegisterLink>
                </FormContainer>
            </RightSide>
        </Container>
    );
};

export default SignUp;
