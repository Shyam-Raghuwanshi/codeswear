export default function handler(req, res) {
    let pin = {
        '473101': ['Aron', 'Madhya Pradesh'],
        '473105': ['Bamori', 'Madhya Pradesh'],
        '473118': ['Chachoda', 'Madhya Pradesh'],
        '473001': ['Guna', 'Madhya Pradesh'],
        '473222': ['Kumbhraj', 'Madhya Pradesh'],
        '473287': ['Maksoodangarh', 'Madhya Pradesh'],
        '473226': ['Raghogarh', 'Madhya Pradesh'],
    }
    res.status(200).json(pin)
}
