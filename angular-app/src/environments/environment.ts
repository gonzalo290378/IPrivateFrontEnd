export const environment = {
  production: false,
  authorize_uri: 'http://localhost:9000/oauth2/authorize?',
  client_id: 'client',
  redirect_uri: 'http://localhost:4200/authorized',
  scope: 'openid',
  response_type: 'code',
  response_mode: 'form_post',
  code_challenge_method: 'S256',
  token_url: 'http://localhost:9000/oauth2/token',
  resource_url: 'http://localhost:8080/resource/',
  logout_url: 'http://localhost:9000/logout',
  secret_pkce: 'secret',
};
