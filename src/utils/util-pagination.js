class UtilPagination {

    constructor() { }

    methodPagination(page, paginations) {
        // KIỂM TRA NGƯỜI DÙNG NHẤN VÀO BUTTON PREVIOUS - NẼT
        if(!Number(page)) {
            let params = page.split("-");
            let preFix = params[0];
            let currentPage = Number(params[1]);

            // TRƯỜNG HỢP LÀ PREVIOUS
            if(preFix === "previous") {
                if(currentPage === 0) {
                    page = (paginations.length - 1);

                } else {
                    page = currentPage - 1;
                }
            }

            // TRƯỜNG HỢP LÀ NEXT
            if(preFix === "next") {
                if(currentPage === (paginations.length - 1)) {
                    page = 0;

                } else {
                    page = currentPage + 1;
                }
            }
        }

        return page;
    }

}

module.exports = new UtilPagination();