import { create } from './RouteNameBuilder';

if (!process.argv[2]) {
    throw 'An argument for yaml config file path must be provided.'
}

create(process.argv[2], process.argv[3]);
