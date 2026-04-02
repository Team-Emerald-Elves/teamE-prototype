import { Search } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
export function SearchBar() {
    return (
        <InputGroup className="max-w-md py-4 border-2 shadow-md hover:shadow-xl transition-all duration-100 cursor-pointer">
            <InputGroupInput placeholder="Search                                       " />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}
