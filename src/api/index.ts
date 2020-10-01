import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json({no: 'si'});
});

export default router;