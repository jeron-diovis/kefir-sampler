import Kefir from "kefir";
import toSampler, { patch as patchKefirLib } from "../src";
import { assert } from "chai";
import sinon from "sinon";

describe("kefir-sampler", () => {

  it("should require combinator function", () => {
    assert.throws(
      () => toSampler(Kefir.constant("foo")),
      /Combinator function expected/
    )
  });

  it("when calling sampler, should invoke combinator function with stream value and sampler params", () => {
    const stream = Kefir.constant("foo");
    const combinator = sinon.spy(() => {});
    const sampler = toSampler(stream, combinator);

    sampler("bar");

    assert.isTrue(combinator.calledOnce, "Combinator is not called");
    assert.deepEqual(combinator.getCall(0).args, ["foo", "bar"], "Combinator does not receive arguments from stream");
  });

  it("should patch Kefir.Observer, adding method to streams class", () => {
    patchKefirLib(Kefir);

    const stream = Kefir.constant("foo");
    const combinator = sinon.spy(() => {});
    const sampler = stream.toSampler(combinator);

    sampler("bar");

    assert.isTrue(combinator.calledOnce, "Combinator is not called");
    assert.deepEqual(combinator.getCall(0).args, ["foo", "bar"], "Combinator does not receive arguments from stream");
  });
});