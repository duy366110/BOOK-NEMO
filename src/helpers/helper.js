const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;

class Helper  {

    constructor() { }

    // KIỂM TRA KẾT NỐI
    connectCount = () => {
        const COUNTCONNECTION = mongoose.connections.length;
        console.log(COUNTCONNECTION);
    }

    // KIỂM TRA HỆ THỐNG QUÁ TẢI CONNECT
    overloadSystem = () => {
        setTimeout(() => {
            const COUNTCONNECTION = mongoose.connections.length;

            // KIỂM TRA SỐ LƯỢNG CORE HỆ THỐNG
            const CPUCORE = os.cpus().length;
            console.log(`CPU CORE :: ${CPUCORE}`);

            // KIỂM TRẠ BỘ NHỚ ĐÃ ĐƯỢC SỬ DỤNG
            const MEMORYUSAGE = process.memoryUsage().rss;
            console.log(`MEMORY USE :: ${MEMORYUSAGE / 1024 / 1024}`);

            // SỐ LƯỢNG CONNECT TỐI ĐA
            const MAXCONNECT = CPUCORE * 5 // SỐ USER TRÊN MỘT CODE;

            if(COUNTCONNECTION > MAXCONNECT) {
                console.log('Update CPU USERCONNECTION LARGE');

            } else {
                console.log('CPU NORMAL');
            }

        }, _SECONDS)
    }

}

module.exports = new Helper();