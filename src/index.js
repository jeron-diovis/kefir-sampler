import Bus from "kefir-bus";

const noop = () => {};

export default function streamToSampler(stream, fn) {
  if (typeof fn !== "function") {
    throw new Error("[kefir-sampler] Combinator function expected");
  }

  const bus = new Bus();
  stream
    .sampledBy(bus, fn)
    .onAny(noop); // ensure stream is activated
  return bus.emit;
}

export function patch(Kefir) {
  Kefir.Observable.prototype.toSampler = function instanceStreamToSampler(fn) {
    return streamToSampler(this, fn);
  };
}