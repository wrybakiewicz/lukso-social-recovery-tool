CREATE TABLE recovery_contract_addresses
(
    address                   TEXT PRIMARY KEY,
    recovery_contract_address TEXT
);

CREATE TABLE guardians_addresses
(
    guardian_address TEXT,
    recovery_address TEXT,
    PRIMARY KEY (guardian_address, recovery_address),
    FOREIGN KEY (recovery_address) REFERENCES recovery_contract_addresses (address)
);