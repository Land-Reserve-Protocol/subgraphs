import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { NewZone, Paused, Unpaused } from "../generated/Actions/Actions"

export function createNewZoneEvent(
  zone: Address,
  name: string,
  symbol: string,
  lat: BigInt,
  lng: BigInt
): NewZone {
  let newZoneEvent = changetype<NewZone>(newMockEvent())

  newZoneEvent.parameters = new Array()

  newZoneEvent.parameters.push(
    new ethereum.EventParam("zone", ethereum.Value.fromAddress(zone))
  )
  newZoneEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  newZoneEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  newZoneEvent.parameters.push(
    new ethereum.EventParam("lat", ethereum.Value.fromUnsignedBigInt(lat))
  )
  newZoneEvent.parameters.push(
    new ethereum.EventParam("lng", ethereum.Value.fromUnsignedBigInt(lng))
  )

  return newZoneEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
