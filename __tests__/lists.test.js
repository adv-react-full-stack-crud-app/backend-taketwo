const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST user can add item to list', async () => {
    const itemObject = {
      description: 'Clean shower',
      completed: false,
    };

    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/lists').send(itemObject);
    expect(res.status).toEqual(200);
  });
  it('GET displays all list items', async () => {
    const [agent] = await registerAndLogin();
    const list = { description: 'clean the car', completed: false };
    const res = await agent.post('/api/v1/lists').send(list);
    expect(res.status).toBe(200);

    const resp = await agent.get('/api/v1/lists');
    expect(resp.body).toEqual([{ ...list, id: '1', user_id: '1' }]);
  });
});
