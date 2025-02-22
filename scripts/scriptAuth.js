import http from 'k6/http';
import { check, sleep } from 'k6';

// Configurações do teste
export const options = {
  vus: 5, // Número de usuários virtuais
  duration: '10s', // Duração do teste
};

let token = "";

// Função principal
export default function () {

  // 3. Endpoint para criar um usuário
  const getUserUrl = 'https://my-public-api-for-tests-production.up.railway.app/api/users';


  // Headers para a requisição de listagem de usuário (inclui o token)
  const userHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${pegarToken()}`, // Adiciona o token no header de autorização
  };

  // 4. Faz a requisição GET para buscar um usuário
  const getUserResponse = http.get(getUserUrl, { headers: userHeaders });

  // Verifica se a listagem dos usuários foi bem-sucedida (status code 201)
  check(getUserResponse, {
    'Usuários listados com sucesso': (r) => r.status === 200,
  });

  // Aguarda 1 segundo antes da próxima iteração
  sleep(1);
}

function pegarToken() {
  if (token == "") {
    const authUrl = 'https://my-public-api-for-tests-production.up.railway.app/api/login';
  
    const authPayload = JSON.stringify({
      username: 'admin',
      password: '12345',
    });
  
    const authHeaders = {
      'Content-Type': 'application/json',
    };
  
    const authResponse = http.post(authUrl, authPayload, { headers: authHeaders });
  
    check(authResponse, {
      'Autenticação bem-sucedida': (r) => r.status === 200,
    });
    token = authResponse.json('token');
    console.log(token);
    return token;
  } else {
    return token;
  }
  
}