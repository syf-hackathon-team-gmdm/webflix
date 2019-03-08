![](./source/extension/assets/64.png)

# webflix

## Sample

> magnet:?xt=urn:btih:BCW2LJ5GDA5K4HQJ3AY56Z2I2VTASWQQ&dn=Sintel&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969

## Dependencies

```bash
~$ make deps
```

## Build

1. Build **webflix.js** and **webflix.css** library:

```bash
~$ make webflix.css  # ./build
~$ make webflix.js   # ./build
```

2. Build browser extension:

```bash
~$ make chrome && make firefox  # ./build
```

## License

**webflix** is under [MIT License](./LICENSE).
