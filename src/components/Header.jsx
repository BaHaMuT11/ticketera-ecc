

const Header = () => {
    return (
        <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex flex-row justify-content-center align-items-baseline gap-2">
                <h1 className="display-6 mb-0">
                    <strong>TICKETERA ECC</strong>
                </h1>
                <span className="text-danger fw-bold" style={{ fontSize: "1rem" }}>V3.1.1</span>
            </div>
            <h6 className="mb-0">By BaHaMuT</h6>
        </div>
    );
};

export default Header;