const express = require('express');
const userHandler = require('app/handlers/user');
const { excludeFields } = require('app/utils/picker');
const { assertNotNull } = require('app/utils/validator');

const router = express();
const subRouter = express();

router.post('/', async (req, res, next) => {
  try {
    const result = await userHandler.createUser(req.body);
  
    res.json({ data: result });

  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await userHandler.getUsers(req.query);
    res.json({ data: result});

  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    assertNotNull(req.body, 'username');
    assertNotNull(req.body, 'password');

    const result = await userHandler
      .authenticateUserByUsername(req.body.username, req.body.password);
    
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.use(
  '/:id',
  (req, res, next) => {
    req.parent = {};
    req.parent.identifier = req.params.id;
    next();
  },
  subRouter
);

subRouter.get('/', async (req, res, next) => {
  try {
    const result = await userHandler.getUserByIdentifier(req.parent.identifier);

    res.json({ data: excludeFields(result, ['password'])})
  } catch (error) {
    next(error);
  }
});

subRouter.put('/', async (req, res, next) => {
  try {
    const result = await userHandler
      .updateUser(req.parent.identifier, req.body);

    res.json({ data: result });
  } catch (error) {

  }
})

subRouter.delete('/', async (req, res, next) => {
  try {
    const result = await userHandler.deleteUser(req.parent.identifier);

    if (result) {
      res.sendStatus(204);
    } else {
      res.status(400).json({ message: 'user not found '});
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;
